import { Controller, Get, Post, Body } from '@nestjs/common'
import { TestService } from './test.service.js'

@Controller('test')
export class TestController {
    constructor(private testService: TestService) {}

    @Get()
    findAll() {
        return this.testService.findAll()
    }

    @Post()
    create(@Body('title') title: string) {
        return this.testService.create(title)
    }
}