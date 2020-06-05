import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigurationService {
    // return the number of days a vocabulary should remain on given level
    getDueInDays(level: number): number {
        let nextDueIn: number;
        switch (level) {
            case 1:
                nextDueIn = 0;
                break;
            case 2:
                nextDueIn = 1;
                break;
            case 3:
                nextDueIn = 3;
                break;
            case 4:
                nextDueIn = 9;
                break;
            case 5:
                nextDueIn = 29;
                break;
            case 6:
                nextDueIn = 90;
                break;
            default:
                nextDueIn = 0;
                break;
        }
        return nextDueIn;
    }
}
