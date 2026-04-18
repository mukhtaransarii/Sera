// signup
export const signup = async (name: string, email: string, password: string) => {
 try {
   const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    console.log(data)

    if(!data.success) return 
    return data
 } catch (error) {
   console.log("something went wrong", error);
 }
}

// login
export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data)
    
    if(!data.success) return 
    return data
  } catch (error) {
    console.log("something went wrong", error);
  }
}

// logout
export const logout = async () => {
  try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    console.log(data)
    
    if(!data.success) return 
    return data
  } catch (error) {
    console.log("something went wrong", error);
  }
}

// me
export const me = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    console.log(data)
    
    if(!data.success) return 
    return data
  } catch (error) {
    console.log("something went wrong", error);
  }
}