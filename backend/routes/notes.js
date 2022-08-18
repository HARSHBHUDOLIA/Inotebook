const express = require("express")
const router = express.Router()
const fetchuser = require("../middleware/fetchuser")
const { body, validationResult } = require("express-validator")
const Notes = require("../models/Notes")

//ROUTE 1: Get all The Notes :GET "/api/notes/fetchallnotes". Doesn't require auth(no login required)
router.get("/fetchallnotes", fetchuser, async (req, res) => {
   try {
      const notes = await Notes.find({ user: req.user.id })
      res.json(notes)
   } catch (error) {
      res.status(400).json("Some Internal Error Occured")
      console.error(error)
   }
})

//ROUTE 2: Add a New Note :Post "/api/notes/createuser". Doesn't require auth(no login required)
router.post(
   "/addnote",
   fetchuser,
   [
      body("title", "Enter a Valid name ").isLength({ min: 3 }),
      body("description", "Description mjust be atleast 5 characters").isLength(
         { min: 5 }
      ),
   ],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }
      try {
         const { title, description, tag } = req.body
         const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id,
         })
         const savedNote = await note.save()
         res.json(savedNote)
      } catch (error) {
         res.status(400).json("Some Internal Error Occured")
         console.error(error)
      }
   }
)
//ROUTE 3: Updatae an Existing Note :Put "/api/notes/updatenote" Login Required.
router.put(
   "/update/:id",
   fetchuser,

   async (req, res) => {
      const { title, description, tag } = req.body
      //create a new note object
      try {
         const newNote = {}
         if (title) {
            newNote.title = title
         }
         if (description) {
            newNote.description = description
         }
         if (tag) {
            newNote.tag = tag
         }
         //Find the note to be updated and update it
         let note = await Notes.findById(req.params.id)
         if (!note) {
            return res.status(404).send("not found")
         }
         if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
         }
         note = await Notes.findByIdAndUpdate(
            req.params.id,
            { $set: newNote },
            { new: true }
         )
         res.json({ note })
      } catch (error) {
         res.status(400).json("Some Internal Error Occured")
         console.error(error)
      }
   }
)

//ROUTE 4: Delete an Existing Note :Post "/api/notes/deletenote" Login Required.
router.delete(
   "/deletenote/:id",
   fetchuser,

   async (req, res) => {
      
      //create a new note object

      //Find the note to be deleted and delete it

      try {
         let note = await Notes.findById(req.params.id)
         if (!note) {
            return res.status(404).send("not found")
         }

         //Allows deletion if only user owns the Note
         if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
         }
         note = await Notes.findByIdAndDelete(req.params.id)
         res.json({ Success: "Note Has Been Deleted" })
      } catch (error) {
         res.status(500).json("Some Internal Error Occured")
         console.error(error)
      }
   }
)

module.exports = router
