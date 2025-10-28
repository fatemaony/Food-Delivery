import {sql} from '../config/db.js'

export const createUser = async(req, res)=>{

  const {name, email, image, password, role}=req.body

  // Make image optional and provide default value
  const userImage = image || 'https://via.placeholder.com/150';
  const userRole = role || 'user';

  if (!name || !email || !password) {
    return res.status(400).json({success:false,message:"Name, email, and password are required"} )
  }

  try {
    const newUser = await sql`
    INSERT INTO users (name, email, image, password, role)
    VALUES(${name},${email},${userImage},${password},${userRole})
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

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await sql`
      SELECT id, name, email, image, role, created_at 
      FROM users 
      WHERE email = ${email}
    `;

    if (user.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: user[0]
    });

  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch user",
      error: error.message 
    });
  }
};
export const updateUser = async(req, res)=>{

  const {id}=req.params;
  const {name, email, image, password, role}=req.body;

  try {
    const currentUserResult = await sql`SELECT * FROM users WHERE id = ${id}`;
    if (currentUserResult.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const currentUser = currentUserResult[0];

    const updatedUserData = {
      name: name !== undefined ? name : currentUser.name,
      email: email !== undefined ? email : currentUser.email,
      image: image !== undefined ? image : currentUser.image,
      password: password !== undefined ? password : currentUser.password,
      role: role !== undefined ? role : currentUser.role
    };
    
    const updateUser = await sql`
    UPDATE users
    SET name=${updatedUserData.name}, email=${updatedUserData.email}, image=${updatedUserData.image}, password=${updatedUserData.password}, role=${updatedUserData.role}
    WHERE id=${id}
    RETURNING *
    `;

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
