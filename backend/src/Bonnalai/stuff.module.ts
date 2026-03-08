import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {files} from "./stuff.entities";
import {StuffController} from "./stuff.controller";
import {StuffService} from "./stuff.service";


@Module({
    imports:[TypeOrmModule.forFeature([files])],
    controllers:[StuffController],
    providers:[StuffService],
    exports: [TypeOrmModule]
})

export class StuffModule {}