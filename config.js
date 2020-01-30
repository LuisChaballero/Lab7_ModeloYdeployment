// mongodb+srv://luis:luis@cluster0-g8ctf.mongodb.net/blog?retryWrites=true&w=majority
// mongodb://localhost/blog
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://luis:luis@cluster0-g8ctf.mongodb.net/blog?retryWrites=true&w=majority";
exports.PORT = process.env.PORT || 8080;