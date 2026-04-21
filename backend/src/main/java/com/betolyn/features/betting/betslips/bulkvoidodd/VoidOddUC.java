package com.betolyn.features.betting.betslips.bulkvoidodd;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.features.IUseCase;
import com.betolyn.features.betting.odds.OddRepository;
import com.betolyn.shared.exceptions.EntityNotfoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoidOddUC implements IUseCase<VoidOddParam, Void> {
    private final OddRepository oddRepository;
    private final BulkVoidOddUC bulkVoidOddUC;

    @Override
    @Transactional
    public Void execute(VoidOddParam param) {
        var odd = oddRepository.findById(param.oddId())
                .orElseThrow(EntityNotfoundException::new);

        bulkVoidOddUC.execute(new BulkVoidOddParam(
                odd.getId(),
                TransactionReferenceTypeEnum.OUTCOME,
                TransactionTypeEnum.OUTCOME_VOID,
                param.reason(),
                odd.getName(),
                List.of(odd.getId())));

        return null;
    }
}
