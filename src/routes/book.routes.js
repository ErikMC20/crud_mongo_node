const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

//MIDDLEWARE
const getBook = async(req, res, next) => {
    let book;
    const { id } = req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({
            message: 'Id invalido'
        })
    }

    try{
        book = await Book.findById(id);
        if(!book){
            return res.status(404).json({
                message: 'Book not found'
            });
        }
    }
    catch(e){
        return res.status(500).json({message: e.message});
    }
    res.book = book;
    next();
}

//obtener todos los libros GET ALL
router.get('/', async(req, res)=>{
    try{
        const books = await Book.find();
        console.log('GET ALL', books)
        if(books.length===0){
            return res.status(204).json([]);
        }
        res.json(books);
    }
    catch(e){
        res.status(500).json({
            message: e.message
        })
    }
})

// crear un nuevo libro (recurso) POST

router.post('/', async(req,res)=>{
    const { title, author, publication_date, gender } = req?.body;
    if(!title || !author || !publication_date || !gender){
        return res.status(400).json({
            message: 'Los campos son obligatorios'
        })
    }

    const book = new Book({
        title,
        author, 
        publication_date, 
        gender
    })

        try{
            const newBook = await book.save();
            console.log(newBook);
            res.status(201).json(newBook);
        }
        catch(e){
            res.status(404).json({
                message: e.message
            })
        }
    }
)

//OBTENER UN LIBRO POR ID

router.get('/:id', getBook, (req, res)=>{
    res.json(res.book); //el primer res es del presente callback, el segundo es del middleware ya que tambien lo posee
})

// MODIFICAR UN LIBRO CON PUT
router.put('/:id', getBook, async(req, res)=>{
 try{
    const book = res.book;
    
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.publication_date = req.body.publication_date || book.publication_date;
    book.gender = req.body.gender || book.gender;

    const updateBook = await book.save();
    res.json(updateBook)
    }
    catch(e){
        res.json({
            message: e.message
        })
    }
})

router.patch('/:id', getBook, async(req, res)=>{
    try{
       const book = res.book;

       if(!book.title && !book.author && !book.publication_date && !book.gender){
            return res.status(400).json({
                message:'Debe ingresar al menos un campo'
            })
       }
       
       book.title = req.body.title || book.title;
       book.author = req.body.author || book.author;
       book.publication_date = req.body.publication_date || book.publication_date;
       book.gender = req.body.gender || book.gender;
   
       const updateBook = await book.save();
       res.json(updateBook)
       }
       catch(e){
           res.json({
               message: e.message
           })
       }
})

router.delete('/:id', getBook, async(req, res)=>{
    try{
        const book = res.book;
        await book.deleteOne(
           {
            _id:book._id
           }
        );
        res.json({
            message:'El libro fue eliminado correctamente'
        })
    }catch(e){
        res.status(500).json({
            message:e.message
        })
    }
})

module.exports = router
