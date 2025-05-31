import categoryController from "../controllers/category.controller.js";

const categoryRoute = (fastify) => {
  fastify.post("/category", categoryController.createCategory);
  fastify.get("/category", categoryController.listCategories);
  fastify.get("/category/:id", categoryController.listCategoryById);
  fastify.delete("/category/:id", categoryController.deleteCategory);
  fastify.patch("/category/:id", categoryController.updateCategory);
};

export default categoryRoute;
