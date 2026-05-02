export function getUserId(): string {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = Math.random().toString(36).substr(2, 9);
   localStorage.setItem("userId", userId);
  }
  return userId;
}
