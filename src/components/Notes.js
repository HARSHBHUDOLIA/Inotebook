import React from "react"
import { useContext, useRef, useState } from "react"
import noteContext from "../context/notes/noteContext"
import Noteitem from "./Noteitem"
import Addnote from "./Addnote"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
function Notes(props) {
   let navigate = useNavigate()
   const context = useContext(noteContext)
   const { notes, getNotes,editNote } = context
   useEffect(() => {
      if(localStorage.getItem('token'))
      {getNotes()}
      else{
         navigate("/login")
      }
      // eslint-disable-next-line
   }, [])
   const [note, setNote] = useState({
      id: "",
      etitle: "",
      edescription: "",
      etag: "default",
   })
   const handleClick = (e) => {
      console.log("Updating the log")
      e.preventDefault()
      editNote(note.id,note.etitle,note.edescription,note.tag);
      refClose.current.click()
      props.showAlelrt("Updated Successfully","success")
     
   }
   const onChange = (e) => {
      setNote({ ...note, [e.target.name]: e.target.value })
   }

   const ref = useRef(null)
   const refClose = useRef(null)
   const updateNote = (currentNote) => {
      ref.current.click()
      setNote({
         id: currentNote._id,
         etitle: currentNote.title,
         edescription: currentNote.description,
         etag: currentNote.tag,
      })
     
   }
   return (
      <>
         <Addnote showAlelrt={props.showAlelrt} />

         <button
            type="button"
            className="btn btn-primary d-none"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            ref={ref}
         >
            Launch demo modal
         </button>
         <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
         >
            <div className="modal-dialog">
               <div className="modal-content">
                  <div className="modal-header">
                     <h5 className="modal-title" id="exampleModalLabel">
                        Edit Note
                     </h5>
                     <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                     ></button>
                  </div>
                  <div className="modal-body">
                     <form className="my-3">
                        <div className="mb-3">
                           <label htmlFor="etitle" className="form-label">
                              Title
                           </label>
                           <input
                              type="text"
                              className="form-control"
                              id="etitle"
                              name="etitle"
                              aria-describedby="emailHelp"
                              onChange={onChange}
                              value={note.etitle}
                              required
                              minLength={3}
                           />
                        </div>
                        <div className="mb-3">
                           <label htmlFor="description" className="form-label">
                              eDescription
                           </label>
                           <input
                              type="text"
                              className="form-control"
                              id="edescription"
                              name="edescription"
                              onChange={onChange}
                              value={note.edescription}
                              required
                              minLength={5}
                           />
                        </div>
                        <div className="mb-3">
                           <label htmlFor="etag" className="form-label">
                              Tag
                           </label>
                           <input
                              type="text"
                              className="form-control"
                              id="etag"
                              name="etag"
                              onChange={onChange}
                              value={note.etag}
                              required
                           />
                        </div>
                     </form>
                  </div>
                  <div className="modal-footer">
                     <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        ref={refClose}
                     >
                        Close
                     </button>
                     <button
                     disabled={note.etitle.length<3||note.edescription.length<5}
                        type="button"
                        className="btn btn-primary"
                        onClick={handleClick}
                     >
                        Update Note
                     </button>
                  </div>
               </div>
            </div>
         </div>
         <div className="row">
            <h2 className="row my-3">Your Note</h2>
            <div className="container">
            {notes.length===0&&"No notes to display"}
            </div>
            {notes.map((note,index) => {
               return (
                  <Noteitem
                     key={`${note._id}${index}`}
                     note={note}
                     updateNote={updateNote}
                     showAlelrt={props.showAlelrt}
                  />
               )
            })}
         </div>
      </>
   )
}

export default Notes
