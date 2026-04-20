package com.betolyn.features.betting.betslips.bulkvoidodd;

import java.util.List;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.features.betting.BettingUtils;
import com.betolyn.features.betting.odds.OddEntity;
import com.betolyn.features.betting.odds.OddRepository;
import com.betolyn.features.matches.findmatchbyid.FindMatchByIdUC;
import com.betolyn.shared.exceptions.BusinessRuleException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoidMatchUC implements IUseCase<VoidMatchParam, Void> {
    private final FindMatchByIdUC findMatchByIdUC;
    private final OddRepository oddRepository;
    private final BulkVoidOddUC bulkVoidOddUC;

    @Override
    public Void execute(VoidMatchParam param) {
        findMatchByIdUC.execute(param.matchId());

        List<String> voidableOddIds = oddRepository.findAllByMatchId(param.matchId()).stream()
                .filter(BettingUtils::isOddVoidable)
                .map(OddEntity::getId)
                .toList();

        if (voidableOddIds.isEmpty()) {
            throw new BusinessRuleException("NOTHING_TO_VOID", "No voidable odds for this match");
        }

        bulkVoidOddUC.execute(new BulkVoidOddParam(
                param.matchId(),
                TransactionReferenceTypeEnum.MATCH,
                TransactionTypeEnum.MATCH_VOID,
                param.reason(),
                voidableOddIds));

        return null;
    }
}
