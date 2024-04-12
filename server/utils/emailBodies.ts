

export const generateActivationCodeEmail = async( code : string  , name : string  ) =>{
    return  ` 
       <div class="container" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Email Activation Code</h2>
        <h2 style="color: #007bff; text-align: center;">Hello ${name}</h2>
    
        <div style="margin-top: 20px; text-align: center;">
            <p style="margin-bottom: 10px;">Activation Code: <strong>${code}</strong></p>
            <p>Use the activation code above to activate your account.</p>
        </div>
    
        <button style="display: block; width: 100%; padding: 10px; margin-top: 20px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Activate</button>
    </div>
    `
}


export const generateNewOrderBody = ( courseName : string , name : string ) =>{
      return `
      <div class="container" style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center; margin-bottom: 20px;">🚀 New Course Purchased! 🚀</h2>
      <h3 style="color: #007bff; text-align: center; margin-bottom: 20px;">Hello ${name},</h3>
  
      <div style="margin-top: 20px; text-align: center;">
          <p style="margin-bottom: 10px; font-size: 18px;">Course Name: <strong>${courseName}</strong></p>
          <p style="font-size: 16px;">We're excited to let you know that you've successfully purchased a new course.</p>
      </div>
  </div>
  
      `
}
