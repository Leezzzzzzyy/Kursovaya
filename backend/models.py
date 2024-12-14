from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.sqlite import insert


db = SQLAlchemy()

students_tasks = db.Table('users_tasks',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key = True),
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key = True),
    db.Column('is_completed', db.Boolean, default = False)
)

class User(db.Model): 
    __tablename__ = "users" 
     
    id = db.Column(db.Integer, primary_key=True) 
    email = db.Column(db.String(100), nullable=False, unique=True) 
    nickname = db.Column(db.String(150)) 
    password_hash = db.Column(db.String(150), nullable=False) 
    is_teacher = db.Column(db.Boolean, default=False) 
     
    visited_tasks = db.relationship( 
        'Task', 
        secondary=students_tasks, 
        back_populates='users' 
    ) 
     
    created_tasks = db.relationship('Task', back_populates='author') 
 
    def set_password(self, password): 
        self.password_hash = generate_password_hash(password) 
         
    def check_password(self, password): 
        return check_password_hash(self.password_hash, password) 
     
    def task_try(self, task_id, status): 
        try: 
            # Используем insert с on_conflict_do_update для обновления записи, если она уже существует 
            stmt = insert(students_tasks).values( 
                task_id=task_id, 
                user_id=self.id, 
                is_completed=status 
            )
 
            # Обработка конфликта: обновляем is_completed, если запись уже существует 
            stmt = stmt.on_conflict_do_update( 
                index_elements=[students_tasks.c.user_id, students_tasks.c.task_id], 
                set_=dict(is_completed=status) 
            ) 
 
            # Выполнение запроса 
            db.session.execute(stmt) 
            db.session.commit() 
 
            # Используем db.session.query() вместо select для получения записи 
            result = db.session.query(students_tasks).filter_by( 
                user_id=self.id, 
                task_id=task_id 
            ).first() 
 
            # Формируем данные для ответа 
            if result: 
                data = { 
                    "user_id": result.user_id, 
                    "task_id": result.task_id, 
                    "is_completed": result.is_completed 
                } 
                print(data) 
            else: 
                print("No data found") 
 
        except Exception as e: 
            db.session.rollback() 
            print("Error in model function") 
            print(e)

    
class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(200), nullable = False)
    description = db.Column(db.String(1000), nullable = False)
    correct_answer = db.Column(db.String(100), nullable = False)
    
    created_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
    
    author = db.relationship('User', back_populates = 'created_tasks')
    
    users = db.relationship(
        'User', 
        secondary = students_tasks, 
        back_populates = 'visited_tasks'
    )
