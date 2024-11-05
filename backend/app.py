from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

from config import Config
from models import db, students_tasks, Task, User


app = Flask(__name__)
db.init_app(app)
app.config.from_object(Config)
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
                "message": f"""
                User with email: {users_email} are existing.
                Please try another email!
                """
                }), 400
            
    new_user = User(email=users_email)
    new_user.set_password(users_password)
    db.session.add(new_user)
    db.session.commit()
        
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
    if existing_user and existing_user.check_password(users_email):
        access_token = create_access_token(identity=existing_user.id)
        return jsonify(access_token=access_token), 200
    
    bad_response = {
        "message": "Invalid email or password!"
    }
    return jsonify(bad_response), 400

@app.route("/api/profile", methods=['GET'])
@jwt_required()
def profile():
    pass
