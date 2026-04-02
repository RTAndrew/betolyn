package com.betolyn.features.bankroll.account.transfermoneytouser;

import com.betolyn.features.IUseCase;
import com.betolyn.features.bankroll.transaction.TransactionEntity;
import com.betolyn.features.bankroll.transaction.transfermoney.TransferMoneyGenericParam;
import com.betolyn.features.bankroll.transaction.transfermoney.TransferMoneyGeneric;
import com.betolyn.features.user.finduserbyid.FindUserByIdUC;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransferMoneyToUserUC implements IUseCase<TransferMoneyGenericParam, TransactionEntity> {
    private final TransferMoneyGeneric transferMoneyGeneric;
    private final FindUserByIdUC findUserByIdUC;

    @Override
    public TransactionEntity execute(TransferMoneyGenericParam param) {
        // both users must be found so P2P can happen
        findUserByIdUC.execute(param.fromOwnerId());
        findUserByIdUC.execute(param.toOwnerId());

        return transferMoneyGeneric.execute(param);
    }
}
