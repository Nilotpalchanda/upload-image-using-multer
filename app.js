//config module
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var multer = require('multer')
var path = require('path')
var mongoose = require('mongoose')
var Details = require('./models/details')
var port = process.env.PORT || 3000

//connect mongo
mongoose.connect('mongodb://admin:test@ds147118.mlab.com:47118/neelcrud');

// configure multer
var upload = multer({storage: multer.diskStorage({

  destination: function (req, file, callback) 
  { callback(null, './uploads');},
  filename: function (req, file, callback) 
  { 
  	callback(null, (file.originalname));
  }

}),

fileFilter: function(req, file, callback) {
  var ext = path.extname(file.originalname)
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return callback(/*res.end('Only images are allowed')*/ null, false)
  }
  callback(null, true)
}
});



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

//config port
app.listen(port)
console.log( `server running on -> ${port}` )


//config route

app.get('/', (req,res)=>{
	res.render('index')
})

app.post('/post', upload.any(), (req,res)=>{
  console.log("req.body"); //form fields
  console.log(req.body);
  console.log("req.file");
  console.log(req.files); //form files
// simple validation
if(!req.body && !req.files){
	res.json({success : false})
} else {

 var details = new Details ({
 
   Post_title : req.body.post_title,
   Post_image : req.files[0].filename,
   Post_comment : req.body.post_comment

 })

  details.save((err, neel)=>{
  	if(err){
  		console.log(err)
  	}else{
  		res.render('index');
  	}
  })


}
})


app.get('/blogs',(req,res)=>{
	Detail.find({},(err,data)=>{
		if(err){
			console.log(err)
		}else{
			res.render('blogs',{data:data})
		}
	})
})