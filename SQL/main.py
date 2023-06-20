import sqlalchemy as sq
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    fullname = Column(String)

    address = relationship("address", back_populates="user", cascade="all, delete, delete-orphan")
    
    def __repr__(self):
        return f"User(id={self.id}, name='{self.name}', fullname='{self.fullname}')"

class Address(Base):
    __tablename__ = 'address'
    id = Column(Integer, primary_key=True)
    email_address = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    user = relationship("User", back_populates="address")
    
    def __repr__(self):
        return f"Address(id={self.id}, email_address='{self.email_address}')"
    
############################################

#Coneção com o banco de dados
engine = create_engine('sqlite://')

#Criação das tabelas
Base.metadata.create_all(engine)

inspertor_Engine = sq.inspect(engine)
print(inspertor_Engine.has_table("user_account"))

print(inspertor_Engine.get_table_names())
print(inspertor_Engine.default_schema_name)


with Session(engine) as session:
    Ed_Jones = User(name="ed", 
                    fullname="Ed Jones", 
                    address=[Address(email_address="Edjones@gmail.c4m")])
    
    Sand = User(name="sand", 
                fullname="Sand Smith", 
                address=[Address(email_address="sandsmith@email.com"), 
                         Address(email_address="sandsmit@email.com")])
    
    Patrick = User(name="patrick", fullname="Patrick Jones", )
    
    #Enviar os dados para o banco de dados
    session.add_all([Ed_Jones, Sand, Patrick])
    session.commit()

start = sq.select(User).where(User.name == "ed")