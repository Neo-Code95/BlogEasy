import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));
import methodOverride from 'method-override';
import expressLayouts from "express-ejs-layouts";


const app = express();
// const port = 3000;
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('method')); // Changed from '_method' to 'method'
app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "layout");

let posts = [];
let nextId = 1;


// get homepage
app.get("/", (req, res) => {
    res.render("index.ejs", { posts });
});

// create a post
app.post("/posts", (req,res) => {
    const { title, body } = req.body;
    posts.unshift({id: nextId++, title, body });
    res.redirect("/");
});


// click "edit" 
app.get("/posts/:id/edit", (req,res) => {
    // console.log("Attempting to edit post with ID:", req.params.id); // Added for debugging
    const post = posts.find(p => p.id === parseInt(req.params.id));
    // console.log("Found post:", post); // Added for debugging
    if (!post) return res.sendStatus(404);
    res.render("edit.ejs", { post });
})


// after editing, want to submit
app.put("/posts/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id))
    if (!post) {
        return res.status(404).send("Post not found");
    }

    post.title = req.body.title;
    post.body = req.body.body;
    
    res.redirect("/");
});


// delete post
app.delete("/posts/:id", (req, res) => {
    posts = posts.filter(p => p.id != parseInt(req.params.id))
    res.redirect("/");
});




app.listen(port, () => {
 console.log(`Listening to port ${port}.`)
});