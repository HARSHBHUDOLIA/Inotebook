import React, { useState } from "react"
import { useContext } from 'react';
import noteContext from '../context/notes/noteContext';
const Addnote = (props) => {
    const context=useContext(noteContext);
    const {addNote}=context;
    const [note,setNote]=useState({title:"",description:"",tag:""})
    const handleClick=(e)=>{
        e.preventDefault();
            addNote(note.title,note.description,note.tag)
            setNote({title:"",description:"",tag:""})
            props.showAlelrt("Added Successfully","success")
    }
    const onChange=(e)=>{
            setNote({...note,[e.target.name]:e.target.value})
    }
   return (
      <div>
         <h2 className="my-3"> Add a Note</h2>
         <form className="my-3">
            <div className="mb-3">
               <label htmlFor="title" className="form-label">
                  Title
               </label>
               <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  aria-describedby="emailHelp"
                  onChange={onChange}
                  required
                  minLength={3}
                  value={note.title}

               />
               
            </div>
            <div className="mb-3">
               <label htmlFor="description" className="form-label">
                  Description
               </label>
               <input
                  type="text"
                  className="form-control"
                  id="description"
                  name="description"
                  onChange={onChange}
                  required
                  minLength={5}
                  value={note.description}
               />
            </div>
            <div className="mb-3">
               <label htmlFor="tag" className="form-label">
                  Tag
               </label>
               <input
                  type="text"
                  className="form-control"
                  id="tag"
                  name="tag"
                  onChange={onChange}
                  required
                  value={note.tag}

               />
            </div>
           
            <button disabled={note.title.length<3||note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>
               Add Note
            </button>
         </form>
      </div>
   )
}

export default Addnote
