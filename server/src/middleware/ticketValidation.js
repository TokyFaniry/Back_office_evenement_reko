export const validateTicketInput = (req, res, next) => {
  const { eventId, categoryId, email, telephone } = req.body;
  const errors = [];

  if (!Number.isInteger(Number(eventId))) errors.push("Invalid event ID");
  if (!Number.isInteger(Number(categoryId))) errors.push("Invalid category ID");
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
    errors.push("Invalid email");
  if (!/^\+?[1-9]\d{1,14}$/.test(telephone))
    errors.push("Invalid phone number");

  if (errors.length > 0) return res.status(422).json({ errors });
  next();
};
