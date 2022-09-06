// SIGN OUT CONTROLLER
exports.signOut = async (req, res) => {

    try {
        await req.session.destroy();

        res.json("SIGNED Out!!");

    } catch (err) {
        console.log("SIGNED OUT ERROR: ", err);
    }

}