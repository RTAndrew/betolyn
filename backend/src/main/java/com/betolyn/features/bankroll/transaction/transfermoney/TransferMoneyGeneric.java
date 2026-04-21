package com.betolyn.features.bankroll.transaction.transfermoney;

import java.util.Objects;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.bankroll.account.findaccountbyownerid.FindAccountByOwnerIdUC;
import com.betolyn.features.bankroll.transaction.TransactionEntity;
import com.betolyn.features.bankroll.transaction.TransactionItemEntity;
import com.betolyn.features.bankroll.transaction.TransactionRepository;
import com.betolyn.shared.exceptions.BusinessRuleException;
import com.betolyn.shared.exceptions.EntityNotfoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class TransferMoneyGeneric implements IUseCase<TransferMoneyGenericParam, TransactionEntity> {
    private final FindAccountByOwnerIdUC findAccountByOwnerIdUC;
    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final TransactionRepository transactionRepository;

    /* Transfer any amount FROM and TO an account */
    @Override
    @Transactional
    public TransactionEntity execute(TransferMoneyGenericParam param) {
        if (Objects.equals(param.fromOwnerId(), param.toOwnerId())) {
            throw new BusinessRuleException("CANNOT_SELF_TRANSFER", "It's not possible to transfer money to the same account");
        }

        var authenticatedUser = getAuthenticatedUserUC.execute().orElseThrow(EntityNotfoundException::new);
        var fromAccount = findAccountByOwnerIdUC.execute(param.fromOwnerId());
        var toAccount = findAccountByOwnerIdUC.execute(param.toOwnerId());

        fromAccount.debit(param.amount());
        toAccount.credit(param.amount());

        var transaction = new TransactionEntity();
        transaction.generateId();
        transaction.setMemo(param.memo());
        transaction.setCreatedBy(authenticatedUser.user());
        transaction.setType(param.transactionType());
        transaction.setReferenceId(param.transactionReferenceId());
        transaction.setReferenceType(param.transactionReferenceType());
        transaction.setReferenceName(param.transactionReferenceName());

        var transactionItem = new TransactionItemEntity();
        transactionItem.setAmount(param.amount());
        transactionItem.setFromAccountId(fromAccount.getId());
        transactionItem.setToAccountId(toAccount.getId());
        transactionItem.setToAccountType(param.toAccountType());
        transactionItem.setFromAccountType(param.fromAccountType());
        transactionItem.setTransaction(transaction);
        transaction.getItems().add(transactionItem);

        return transactionRepository.save(transaction);
    }
}
