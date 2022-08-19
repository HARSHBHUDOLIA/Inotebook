import React, { useState } from "react"
import NoteContext from "./noteContext"

const NoteState = (props) => {
   const host = "http://localhost:5000"
   const notesInitial = [
      
   ]
   //Get All notes
   const getNotes = async () => {
      let url = `${host}/api/notes/fetchallnotes`
      const response = await fetch(url, {
         method: "GET",

         headers: {
            "Content-Type": "application/json",
            "auth-token":
              localStorage.getItem('token')
         },
      })
      //  const json = response.json()
      const json = await response.json()
      
      setNotes(json)
   }

   //Add Note
   const addNote = async (title, description, tag) => {
      let url = `${host}/api/notes/addnote`
      const response = await fetch(url, {
         method: "POST",

         headers: {
            "Content-Type": "application/json",
            "auth-token":
              localStorage.getItem('token')
         },

         body: JSON.stringify({ title, description, tag }),
      })
      const note = response.json()
      setNotes(notes.concat(note))
     
     
   }
   //Delete Note
   const deleteNote = async (id) => {
      let url = `${host}/api/notes/deletenote/${id}`
      const response = await fetch(url, {
         method: "Delete",

         headers: {
            "Content-Type": "application/json",
            "auth-token":
              localStorage.getItem('token')
         },
      })
      const json = await response.json()
      console.log(json);
      let newNotes = notes.filter((note) => {
         return note._id !== id
      })
      setNotes(newNotes)
   }
   //Edit Note
   const editNote = async (id, description, title, tag) => {
      const url = `${host}/api/notes/update/${id}`
      const response = await fetch(url, {
         method: "PUT",

         headers: {
            "Content-Type": "application/json",
            "auth-token":
              localStorage.getItem('token')
         },

         body: JSON.stringify({ title, description, tag }),
      })
      const json =await response.json()
      console.log(json)
      let newNotes=JSON.parse(JSON.stringify(notes))
      for (let index = 0; index < notes.length; index++) {
         const element = newNotes[index]
         if (element._id === id) {
          newNotes[index].title = title
          newNotes[index].description = description
          newNotes[index].tag = tag
          break;
         }
       
      }
      setNotes(newNotes);
   }
   const [notes, setNotes] = useState(notesInitial)
   return (
      <NoteContext.Provider
         value={{ notes, addNote, deleteNote, editNote, getNotes }}
      >
         {props.children}
      </NoteContext.Provider>
   )
}
export default NoteState
