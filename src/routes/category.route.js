import categoryController from "../controllers/category.controller.js";

const categoryRoute = (fastify) => {
    fastify.post("/category", categoryController.createCategory);
}

export default categoryRoute;