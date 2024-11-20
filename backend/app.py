from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

from config import Config
from models import db, students_tasks, Task, User


app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

@app.route('/api/registration', methods=['POST'])
def registration():
    data = request.get_json()
    
    users_email = data["email"]
    users_password = data["password"]
    
    existing_user = User.query.filter_by(email=users_email).first()
    
    if existing_user:
            return jsonify({
                "message": f"User with email: {users_email} are existing. Please try another email!"
                }), 404
            
    new_user = User(email=users_email)
    new_user.set_password(users_password)
    db.session.add(new_user)
    db.session.commit()
    
    print(str(new_user.email) + " " + str(new_user.password_hash))
        
    return jsonify({
        "message": "Successfully added new user!",
        "users_data": {
            "email": users_email,
            "password": users_password
        },
        "redirect_url": "/login"
    })

@app.route("/api/login", methods=['POST'])
def login():
    data = request.get_json()
    users_email = data["email"]
    users_password = data["password"]
    
    existing_user = User.query.filter_by(email=users_email).first()
    if existing_user and existing_user.check_password(users_password):
        access_token = create_access_token(identity=existing_user.id)
        return jsonify(access_token=access_token), 200
    
    bad_response = {
        "msg": "Invalid email or password!"
    }
    return jsonify(bad_response), 400

@app.route("/api/profile", methods=['GET'])
@jwt_required()
def profile():
    current_user = User.query.get(get_jwt_identity())
    
    if current_user:
        
        visited_tasks_objects_array = current_user.visited_tasks
        created_tasks_objects_array = current_user.created_tasks
        
        visited_tasks_dicts_array = list()
        created_tasks_dicts_array = list()

        for task in visited_tasks_objects_array:
            new_dict = {
                "task_id": task.id,
                "title": task.title,
                "is_completed": None
            }
            visited_tasks_dicts_array.append(new_dict)
            
        for task in created_tasks_objects_array:
            new_dict = {
                "task_id": task.id,
                "title": task.title
            }
            created_tasks_dicts_array.append(new_dict)
            
        current_user_data = {
            "id": current_user.id,
            "email": current_user.email,
            "nickname": current_user.nickname,
            "is_teacher": current_user.is_teacher,
            "visited_tasks": visited_tasks_dicts_array,
            "created_tasks": created_tasks_dicts_array
        }
        return jsonify(current_user_data), 200
    else:
        return redirect("htpp://localhost:3000/"), 300
    
@app.route("/api/profile/changeNickname", methods=['POST'])
@jwt_required()
def change_nickname():
    current_user = User.query.get(get_jwt_identity())
    new_nickname = request.get_json()['nickname']
    
    if current_user:
        current_user.nickname = new_nickname
        db.session.commit()
        print(current_user.nickname)
        return jsonify({"message": "The nickname successfully changed!"}), 200
    else:
        bad_response = {
        "message": "Error occurs while changing the nickname!"
        }
        return jsonify(bad_response), 400

@app.route("/api/profile/create_task", methods=["POST"])
@jwt_required()
def create_task():
    current_user = User.query.get(get_jwt_identity())
    is_teacher = current_user.is_teacher
    
    if is_teacher:
        task_data = request.get_json()
        task_title = task_data['title']
        task_description = task_data['description']
        correct_answer = task_data['correct_answer']
        
        if task_description and correct_answer:
            new_task = Task(description=task_description, title=task_title, correct_answer=correct_answer)
            current_user.created_tasks.append(new_task)
            new_task.created_user_id = current_user.id
            
            print(new_task)
            
            db.session.add(new_task)
            db.session.commit()
            
            success_response = {
                "msg": "Successfully created new task!",
                "task_data": {
                    "created_user_id": current_user.id,
                    "title": new_task.title,
                    "description": new_task.description,
                    "correct_answer": new_task.correct_answer
                }
            }
            return jsonify(success_response)
        else:
            bad_response = {
                "msg": "Missing data!"
            }
            return jsonify(bad_response)

    else:
        bad_response = {
            "msg": "Current user aren't teacher. Need to update status!"
        }
        return jsonify(bad_response)

@app.route("/api/profile/become_a_teacher", methods=["POST"])
@jwt_required()
def changeStatus():
    current_user = User.query.get(get_jwt_identity())
    change = request.get_json()['change']
    if change:
        current_user.is_teacher = True
    else:
        current_user.is_teacher = False
    
    db.session.commit()
    
    return jsonify({"msg": "Status changed successfully."})

@app.route("/api/get_all_tasks", methods=["GET"])
def return_all_tasks():
    tasks_objects_list = Task.query.all()
    tasks_dicts_list = []
    
    for task in tasks_objects_list:
        creator = User.query.get(task.created_user_id)
        creator_name = creator.nickname
        
        task_description = task.description[:100]
        new_dict = {
            "task_id": task.id,
            "task_title": task.title,
            "task_mini_description": task_description,
            "creator_name": creator_name
        }
        tasks_dicts_list.append(new_dict)
        
    return jsonify({
        "message": "Tasks uploaded successfully!",
        "all_tasks": tasks_dicts_list
    }), 200
    
if __name__ == "__main__":
    app.run(debug=True)
