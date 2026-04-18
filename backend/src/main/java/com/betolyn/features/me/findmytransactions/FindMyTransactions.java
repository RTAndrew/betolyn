package com.betolyn.features.me.findmytransactions;

import java.util.List;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.betolyn.features.bankroll.transaction.TransactionMapper;
import com.betolyn.features.bankroll.transaction.dto.TransactionDTO;
import com.betolyn.features.me.MeApiPaths;
import com.betolyn.utils.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(MeApiPaths.ME)
@RequiredArgsConstructor
public class FindMyTransactions {

    private final FindMyTransactionsUC findMyTransactionsUC;
    private final FindMyTransactionByIdUC findMyTransactionByIdUC;
    private final TransactionMapper transactionMapper;

    @GetMapping("/transactions")
    public ResponseEntity<@NotNull ApiResponse<List<TransactionDTO>>> findMyTransactions() {
        var result = findMyTransactionsUC.execute();
        var response = result.transactions().stream()
                .map(tx -> transactionMapper.toMyTransactionDTO(tx, result.viewerAccountId()))
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Transactions found", response));
    }

    @GetMapping("/transactions/{transactionId}")
    public ResponseEntity<@NotNull ApiResponse<TransactionDTO>> findMyTransactionById(
            @PathVariable String transactionId) {
        var result = findMyTransactionByIdUC.execute(transactionId);
        return ResponseEntity.ok(ApiResponse.success(
                "Transaction found",
                transactionMapper.toMyTransactionDTO(result.transaction(), result.viewerAccountId())));
    }
}
