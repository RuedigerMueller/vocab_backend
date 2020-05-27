import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
    // return the number of days a vocabulary should remain on given level
    getDueInDays(level: number): number {
        let nextDueIn: number;
        switch (level) {
            case 1:
                nextDueIn = 0;
            case 2:
                nextDueIn = 1;
            case 3:
                nextDueIn = 3;
            case 4:
                nextDueIn = 9;
            case 5:
                nextDueIn = 29;
            case 6:
                nextDueIn = 90;
            default:
                nextDueIn = 0;
        }
        return nextDueIn;
    }
}
