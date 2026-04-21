package com.betolyn.features.bankroll.transaction.dto;

import java.math.BigDecimal;
import java.util.List;

import com.betolyn.features.bankroll.transaction.TransactionReferenceTypeEnum;
import com.betolyn.features.bankroll.transaction.TransactionTypeEnum;
import com.betolyn.features.user.UserDTO;

import lombok.Data;

@Data
public class TransactionDTO {

    private String id;
    private String createdAt;
    private String updatedAt;

    private String memo;

    private BigDecimal totalAmount;

    private TransactionTypeEnum type;

    private String referenceId;

    private TransactionReferenceTypeEnum referenceType;

    /** Snapshot label for the reference (omitted for bet slip placements). */
    private String referenceName;

    private UserDTO createdBy;

    // It's okay to return the items since they are not 
    // usually more than 10 items per transaction
    private List<TransactionItemDTO> items;
}
