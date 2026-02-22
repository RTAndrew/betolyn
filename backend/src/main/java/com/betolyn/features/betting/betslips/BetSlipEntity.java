package com.betolyn.features.betting.betslips;

import com.betolyn.features.betting.betslips.enums.BetSlipStatusEnum;
import com.betolyn.features.betting.betslips.enums.BetSlipTypeEnum;
import com.betolyn.features.user.UserEntity;
import com.betolyn.shared.baseEntity.AuditableEntity;
import com.betolyn.shared.baseEntity.EntityUUID;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "bet_slips")
public class BetSlipEntity extends AuditableEntity {

    private Double totalCumulativeOdds;

    @Column(nullable = false)
    private Double totalItemsCount;

    @Column(nullable = false)
    private Double totalStake;

    @Column(nullable = false)
    private Double totalPotentialPayout;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private BetSlipTypeEnum type = BetSlipTypeEnum.SINGLE;

    private String voidReason;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private BetSlipStatusEnum status = BetSlipStatusEnum.PENDING;

    // TODO: delete this
    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @NotNull
    @OneToMany(mappedBy = "betSlip", cascade = CascadeType.ALL)
    private List<BetSlipItemEntity> items = new ArrayList<>();

    @Override
    protected EntityUUID getUUIDPrefix() {
        return new EntityUUID(12, "slip");
    }

    @PreUpdate
    /** Whenever creating a new BetSlip with manual `generateId()`,
     * call the function manually
     *
     */
    public void updateProjections() {
        var count = this.getItems().size();
        if (count == 0) {
            return;
        }

        setTotalItemsCount((double) count);

        var totalStake = this.getItems().stream()
                .mapToDouble(BetSlipItemEntity::getStake)
                .sum();
        setTotalStake(totalStake);

        var totalPotentialPayout = this.getItems().stream()
                .mapToDouble(BetSlipItemEntity::getPotentialPayout)
                .sum();
        setTotalPotentialPayout(totalPotentialPayout);
    }
}
