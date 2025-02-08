import supabase from '../lib/supabase';

// Login function
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

// Signup function
export async function signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

// Logout function
export async function logout() {
  await supabase.auth.signOut();
}

// Get current user
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data;
}
