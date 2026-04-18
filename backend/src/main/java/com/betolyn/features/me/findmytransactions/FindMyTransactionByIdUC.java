package com.betolyn.features.me.findmytransactions;

import java.util.List;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.bankroll.account.findaccountbyownerid.FindAccountByOwnerIdUC;
import com.betolyn.features.bankroll.transaction.TransactionItemEntity;
import com.betolyn.features.bankroll.transaction.TransactionRepository;
import com.betolyn.shared.exceptions.AccessForbiddenException;
import com.betolyn.shared.exceptions.EntityNotfoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindMyTransactionByIdUC implements IUseCase<String, MyTransactionByIdResult> {

    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final FindAccountByOwnerIdUC findAccountByOwnerIdUC;
    private final TransactionRepository transactionRepository;

    @Override
    public MyTransactionByIdResult execute(String transactionId) {
        var loggedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        var account = findAccountByOwnerIdUC.execute(loggedUser.getId());
        var accountId = account.getId();

        var transaction = transactionRepository
                .findByIdWithItems(transactionId)
                .orElseThrow(EntityNotfoundException::new);

        var items = transaction.getItems() != null ? transaction.getItems() : List.<TransactionItemEntity>of();
        var touchesUserAccount = items.stream()
                .anyMatch(i -> accountId.equals(i.getFromAccountId()) || accountId.equals(i.getToAccountId()));

        if (!touchesUserAccount) {
            throw new EntityNotfoundException();
        }
        return new MyTransactionByIdResult(transaction, accountId);
    }
}
