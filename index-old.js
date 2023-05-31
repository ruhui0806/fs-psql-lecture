const main = async () => {
  try {
    await sequelize.authenticate();
    const blogs = await sequelize.query("SELECT * FROM blogs", {
      type: QueryTypes.SELECT,
    });
    console.log(blogs);
    sequelize.close();
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
main();
