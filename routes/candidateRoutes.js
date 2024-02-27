const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const { jwtAuthMiddleware } = require("../jwt");
const User = require("../models/user");


const checkAdminRole = async (userID)=>{
  try {
    const user = await User.findById(userID);
    if(user.role === "admin"){
      return true;
    }
  }catch (error) {
    console.error(error);
    return false;
  }
}

router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if(! await checkAdminRole(req.user.id)){
      return res.status(401).json({ error: "Unauthorized" });
    }
    const newCandidate = new Candidate(req.body);

    const response = await newCandidate.save();
    console.log(" candidate data saved");

    
    res.status(200).json({ response: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if(!checkAdminRole(req.user.id)){
      return res.status(403).json({ error: "Unauthorized" });
    }
    const candidateID = req.params.candidateID;
    const updatedCandidate = req.body;

    const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidate, { new: true, runValidators: true });

    if (!response) {
      return res.status(403).json({ error: "Candidate not found" });
    }
    console.log("candidate data updated");
    res.status(200).json({ response: response });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if(!checkAdminRole(req.user.id)){
      return res.status(403).json({ error: "Unauthorized" });
    }
    const candidateID = req.params.candidateID;
    

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    console.log("candidate deleted");
    res.status(200).json({ response: response });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// voting route

router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
  try {
    const candidateID = req.params.candidateID;
    const userID = req.user.id;

    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if(user.isVoted){
      return res.status(403).json({ error: "User already voted" });
    }
    if(user.role === "admin"){
      return res.status(403).json({ error: "Unauthorized you are admin" });
    }
    if(user.age < 18){
      return res.status(403).json({ error: "User is underage" });
    }

    candidate.votes.push({ user: userID });
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({ response: "Voted successfully" });

    }catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // vote count route

  router.get('/vote/count', jwtAuthMiddleware, async (req, res) => {
    try {
      const candidate = await Candidate.find().sort({ voteCount: 'desc' });
      
      // map the candidates to only return their name and voteCount
      const voteRecord = candidate.map((data) => {
        return {
          party: data.party,
          count: data.voteCount,
        };
      });

      res.status(200).json({ response: voteRecord });

    }
    catch (error){
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
      


module.exports = router;