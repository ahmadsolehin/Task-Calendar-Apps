import Event from "../models/Event.js";
export const SaveEvent = async (req, res) => {
  const { title, start, end, assign_to, assign_from } = req.body;

  try {
    await Event.create({
      title: title,
      start: start,
      end: end,
      assign_to: assign_to,
      assign_from: assign_from,
    });
    res.json({ msg: "Event save successful" });
  } catch (error) {
    console.log(error);
  }
};
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findAll({
      where: {
        assign_to: req.body.assign_to,
      },
    });
    res.json(event);
  } catch (error) {
    console.log(error);
  }
};
