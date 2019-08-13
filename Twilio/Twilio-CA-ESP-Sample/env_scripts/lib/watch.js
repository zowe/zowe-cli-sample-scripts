#! /bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const executeCommand_1 = require("./executeCommand");
const config = require("config");
const nodemon = require("nodemon");
nodemon({
    ext: "jcl rex txt",
    watch: config.get("zos_src.local.folder"),
    exec: "echo Watching for changes"
});
nodemon.on('restart', uploadFile);
function uploadFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = `npm run upload ${filePath}`;
        executeCommand_1.executeCommand(cmd)
            .then((output) => console.log(output))
            .catch((err) => console.error(err));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvd2F0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFZQSxxREFBK0M7QUFDL0MsaUNBQWlDO0FBQ2pDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUVuQyxPQUFPLENBQUM7SUFDSixHQUFHLEVBQUUsYUFBYTtJQUNsQixLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztJQUN6QyxJQUFJLEVBQUUsMkJBQTJCO0NBQ3BDLENBQUMsQ0FBQztBQUVILE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBRWxDLFNBQWUsVUFBVSxDQUFDLFFBQWdCOztRQUN4QyxNQUFNLEdBQUcsR0FBVyxrQkFBa0IsUUFBUSxFQUFFLENBQUM7UUFDakQsK0JBQWMsQ0FBQyxHQUFHLENBQUM7YUFDaEIsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3JDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FBQSJ9