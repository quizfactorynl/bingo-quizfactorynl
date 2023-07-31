import authMiddleware from "@/lib/authMiddleware";

export default authMiddleware(async function handler(req, res) {
    res.status(200).send("success")
});
