const {Router} = require("express");
const {
    getGamePaginationHandler,
    getGamesHandler,
    getGameByIDBDHandler,
    getGameByIDAPIHandler,
    getGameByNameHandler,
    createGameHandler,
    deleteGameHandler,
    updateGameHandler
} = require("../handlers/videosgamesHandler")


const videogamesRouter = Router();

videogamesRouter.get("/main/:page",getGamePaginationHandler);

videogamesRouter.get("/homepage",getGamesHandler);

videogamesRouter.get("/bd/:id",getGameByIDBDHandler);

videogamesRouter.get("/api/:id",getGameByIDAPIHandler);

videogamesRouter.get("/",getGameByNameHandler);

videogamesRouter.post("/new",createGameHandler);

videogamesRouter.delete("/delete/:id",deleteGameHandler)

videogamesRouter.put("/put/:id",updateGameHandler)


module.exports = videogamesRouter;


