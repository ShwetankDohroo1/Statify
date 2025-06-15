import axios from "axios";

export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const response = await axios.get(
      `https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${username}`
    );
    if (response.data && response.data.message === "data retrieved successfully") {
      res.status(200).json(response.data);
    }
    else {
      res.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    console.error("GFG API error:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
