package com.betolyn.features.me.findmytransactions;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.auth.getauthenticateduser.GetAuthenticatedUserUC;
import com.betolyn.features.bankroll.account.findaccountbyownerid.FindAccountByOwnerIdUC;
import com.betolyn.features.bankroll.transaction.TransactionRepository;
import com.betolyn.shared.exceptions.AccessForbiddenException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindMyTransactionsUC implements IUseCaseNoParams<MyTransactionsListResult> {

    private final GetAuthenticatedUserUC getAuthenticatedUserUC;
    private final FindAccountByOwnerIdUC findAccountByOwnerIdUC;
    private final TransactionRepository transactionRepository;

    @Override
    public MyTransactionsListResult execute() {
        var loggedUser = getAuthenticatedUserUC.execute().orElseThrow(AccessForbiddenException::new).user();
        var account = findAccountByOwnerIdUC.execute(loggedUser.getId());
        var accountId = account.getId();

        var transactions = transactionRepository.findAllByAccountId(accountId);
        return new MyTransactionsListResult(transactions, accountId);
    }
}
