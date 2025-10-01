import {sql} from '../config/db.js'

export const createUser = async(req, res)=>{

  const {name, email, image, password, role}=req.body

  if (!name || !email || !image || !password || !role) {
    return res.status(400).json({success:false,message:"all fields are required"} )
  }

  try {
    const newUser = await sql`
    INSERT INTO users (name, email, image, password, role)
    VALUES(${name},${email},${image},${password},${role})
    RETURNING *
    `;

    console.log("new user added", newUser)

    res.status(201).json({ success: true, data: newUser[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message }); 
  }
}

export const getAllUsers = async(req, res)=>{
  try {
    const users = await sql`
      SELECT * FROM users
      ORDER BY created_at DESC
    `;
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export const getUser = async(req, res)=>{
  const { id }=req.params;

  try {
    const user = await sql`
    SELECT * FROM users WHERE id=${id}
    `;
    res.status(200).json({success:true, data:user[0]})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export const updateUser = async(req, res)=>{

  const {id}=req.params;
  const {name, email, image, password, role}=req.body;

  try {
    const updateUser = await sql`
    UPDATE users
    SET name=${name}, email=${email}, image=${image}, password=${password}, role=${role}
    WHERE id=${id}
    RETURNING *
    `;

    if (updateUser.length=== 0) {
      return res.status(404).json({
        success:false,
        message:"User not found",
      })
    }

    res.status(200).json({success:true, data:updateUser[0]})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export const DeleteUser = async(req, res)=>{

  const {id}=req.params;
 try {
const deleteUser=await sql`
DELETE FROM users WHERE id=${id}
RETURNING *
`;      

  console.log("deleteUser",deleteUser)
  if (deleteUser.length===0) {
  return res.status(404).json({
    success:false,
    message:"User not found",
  })
}
res.status(200).json({success:true, data:deleteUser[0]})
 } catch (error) {
  res.status(500).json({ success: false, message: error.message }); 
 }
}
