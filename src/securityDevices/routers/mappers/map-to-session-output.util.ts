import {WithId} from "mongodb";
import {SessionDevice} from "../../domain/sessionDevice";
import {SessionOutput} from "../output/session.output";

export function mapToSessionOutputUtil(session: SessionDevice[]): SessionOutput[] {
    return session.map(session => ({
        ip: session.ip,
        title: session.title,
        lastActiveDate: session.lastActiveDate.toISOString(),
        deviceId: session.deviceId
    }));
}
