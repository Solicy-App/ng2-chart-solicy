declare var require: any
import { ArrayType } from '@angular/compiler';
import { Injectable } from '@angular/core';
const data = require('./sho-data.json');

@Injectable({
	providedIn: 'root',
})
export class SHOMockDataService {
	getUserSHOs(wallet: string) {
		const participant = this.getParticipant(wallet);
		if (!participant?.sho) {
			return [];
		}
		const shoNames = this.getSHONames(participant.sho);
		const shos: any = [];
		shoNames.forEach((name) => {
			const sho = data.sho[name];
			shos.push({ ...sho, key: name });
		});

		return shos;
	}

	getShoVestingPeriod(sho: any) {
		return sho.Vesting[0];
	}

	getShoVestingAmount(sho: any, participant: any) {
		const shoPercent = sho.Vesting[1];
        if (!Array.isArray(shoPercent)) {
            return [];
        }
        
		const participantSho = participant.sho[sho.key];
		if (!participantSho) {
			return [];
		}
		return shoPercent.map((p: any) => p * participantSho.allocations * sho.tokens_per_allo * sho.price_current);
	}

	getParticipant(wallet: string) {
		return data.participant[wallet];
	}

	getSHONames(sho: any) {
		return Object.keys(sho);
	}

	maxVestingOfUser(wallet: string): number {
		const participant = this.getParticipant(wallet);
		if (participant) {
			return participant.max_vesting_remained;
		}

		return 360;
	}

	totalEstimatedValueLocked(wallet: string): number {
		const participant = this.getParticipant(wallet);
		if (participant) {
			return participant.total_estimated_value_locked;
		}
		return -1;
	}
}
