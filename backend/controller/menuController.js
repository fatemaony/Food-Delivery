import {sql} from '../config/db.js'

export const createMenu = async (req, res) => {
  const {name, price, image, description}=req.body

  if (!name || !image || !description || !price ) {
    return res.status(400).json({success:false,message:"all fields are required"} )
  }

  try {
    const newMenu = await sql`
    INSERT INTO menus (name, image, description, price)
    VALUES(${name},${image},${description},${price})
    RETURNING *
    `

    console.log("new Menu added", newMenu)

    res.status(201).json({ success: true, data: newMenu[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message }); 
  }
  
};
export const getAllMenus = async (req, res) => {
  try {
    const menus = await sql`
      SELECT * FROM menus
      ORDER BY created_at DESC
    `;
    res.status(200).json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getMenu = async (req, res) => {
  const { id }=req.params;

try {
  const menu = await sql`
  SELECT * FROM menus WHERE id=${id}
  `;
  res.status(200).json({success:true, data:menu[0]})
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
};
export const updateMenu = async (req, res) => {
  const {id}=req.params;
  const {name, price, image, description}=req.body;

  try {
    const updateMenu = await sql`
    UPDATE menus
    SET name=${name}, image=${image}, description=${description} ,price=${price}
    WHERE id=${id}
    RETURNING *
    `;

    if (updateMenu.length=== 0) {
      return res.status(404).json({
        success:false,
        message:"Menu not found",
      })
    }

    res.status(200).json({success:true, data:updateMenu[0]})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteMenu = async (req, res) => {
  const {id}=req.params;
  try {
 const deleteMenu=await sql`
 DELETE FROM menus WHERE id=${id}
 RETURNING *
 `;      
 
   console.log("deleteMenu",deleteMenu)
   if (deleteMenu.length===0) {
   return res.status(404).json({
     success:false,
     message:"Menu not found",
   })
 }
 res.status(200).json({success:true, data:deleteMenu[0]})
  } catch (error) {
   res.status(500).json({ success: false, message: error.message }); 
  } 
};