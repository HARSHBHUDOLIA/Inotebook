import React, { useState, } from "react"
import {useNavigate} from 'react-router-dom'


const Signup = (props) => {
   const [credentials, setCredentials] = useState({
      name:"",
      email: "",
      password: "",
      cpassword:""
   })
   let navigate = useNavigate();
   const handleSubmit = async (e) => {
      e.preventDefault()
      const {name,email,password}=credentials;
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({name,email,password }),
      })
      const json = await response.json()

      if(json.success){
        //redirect
        localStorage.setItem("token",json.authtoken)
        navigate('/')
        props.showAlert("Account created Successfully","success")
      }
      else{
        props.showAlert("Invalid Credentials","danger")
      }
      console.log(json)
   }
   const onChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value })
   }
   return (
      <div className="container">

         <h2 className="my-3">Signup to Continue to InoteBook</h2>
         <form onSubmit={handleSubmit}>
            <div className="mb-3">
               <label htmlFor="name" className="form-label">
                  Name
               </label>
               <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  aria-describedby="emailHelp"
                  onChange={onChange}
               />
            </div>
            <div className="mb-3">
               <label htmlFor="email" className="form-label">
                  Email address
               </label>
               <input
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  onChange={onChange}
                  name="email"
               />
               <div id="emailHelp" className="form-text">
                  We'll never share your email with anyone else.
               </div>
            </div>
            <div className="mb-3">
               <label htmlFor="password" className="form-label">
                  Password
               </label>
               <input type="password" className="form-control" id="password" name="password" onChange={onChange} required minLength={5}/>
            </div>
            <div className="mb-3">
               <label htmlFor="cpassword" className="form-label">
                  Confirm Password
               </label>
               <input type="cpassword" className="form-control" id="cpassword" name="cpassword" onChange={onChange} required minLength={5}/>
            </div>

            <button type="submit" className="btn btn-primary">
               Submit
            </button>
         </form>
      </div>
   )
}

export default Signup
