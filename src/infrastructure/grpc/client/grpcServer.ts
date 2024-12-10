import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { courseController } from '../../../interface/controllers/courseController';
import config from '../../config/config';

const COURSE_PROTO_PATH = path.resolve(__dirname, '../proto/course.proto');

const coursePackageDefinition = protoLoader.loadSync(COURSE_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});


const courseProtoDescription = grpc.loadPackageDefinition(coursePackageDefinition) as any;

const courseProto = courseProtoDescription.course;

const server = new grpc.Server();

server.addService(courseProto.CourseService.service, {
    userCourse: courseController.useCourse.bind(courseController),
});

const startGrpcServer = () => {
    const grpcPort = config.grpcUrl ; // Assign port 4001 or from config
    server.bindAsync(`${grpcPort}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
        if (err) {
            console.error("Failed to start gRPC server:", err);
        } else {
            console.log(`gRPC server running on port: ${grpcPort}`);
        }
    });
};

startGrpcServer();

export { startGrpcServer };
