export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  setTimeout(() => {
    res.status(200).json({
      message: "AI analysis complete - outfit matches perfectly!",
    });
  }, 800);
}
