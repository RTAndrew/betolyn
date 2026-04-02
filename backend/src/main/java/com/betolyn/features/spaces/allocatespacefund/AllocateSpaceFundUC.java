package com.betolyn.features.spaces.allocatespacefund;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.bankroll.account.AccountTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionEntity;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.features.bankroll.transaction.transfermoney.TransferMoneyGenericParam;
import com.betolyn.features.bankroll.transaction.transfermoney.TransferMoneyGeneric;
import com.betolyn.features.spaces.findspacebyid.FindSpaceByIdUC;
import com.betolyn.shared.exceptions.BusinessRuleException;
import com.betolyn.shared.exceptions.EntityNotfoundException;
import com.betolyn.shared.money.BetMoney;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AllocateSpaceFundUC implements IUseCase<AllocateSpaceFundParam, TransactionEntity> {
    private final FindSpaceByIdUC findSpaceByIdUC;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final TransferMoneyGeneric transferMoneyGeneric;

    @Override
    public TransactionEntity execute(AllocateSpaceFundParam param) {
        var space = findSpaceByIdUC.execute(param.spaceId());
        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(EntityNotfoundException::new);

        if (!space.getCreatedBy().getId().equals(authenticatedUser.user().getId())) {
            throw new BusinessRuleException("ONLY_ADMIN_CAN_FUND", "Only space administrators can provide funding");
        }


        var dto = TransferMoneyGenericParam.builder()
                .memo(param.memo())
                .amount(param.amount())
                .transactionType(TransactionTypeEnum.CHANNEL_FUNDING)
                .toOwnerId(space.getId())
                .toAccountType(AccountTypeEnum.SPACE_AVAILABLE)
                .fromOwnerId(authenticatedUser.user().getId())
                .fromAccountType(AccountTypeEnum.USER_WALLET)
                .build();
        return transferMoneyGeneric.execute(dto);
    }
}
