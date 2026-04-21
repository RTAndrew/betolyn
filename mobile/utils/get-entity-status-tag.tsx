import Tag from '@/components/tags';
import { colors } from '@/constants/colors';
import { CriterionStatusEnum, EOddStatus, IBetSlipItemStatus, MatchStatusEnum } from '@/types';

import { firstLetterUppercase } from './first-letter-uppercase';
import { hexToRgba } from './hex-rgba';

export const getMatchStatusTag = (status?: `${MatchStatusEnum}`) => {
  if (!status) return <></>;

  switch (status) {
    case 'LIVE':
      return <Tag.Live />;
    case 'ENDED':
      return <Tag color={colors.greyLighter} title="Finished" />;
    default:
      return <Tag color={colors.greyLighter} title={firstLetterUppercase(status)} />;
  }
};

export const getOddStatusTag = (status?: `${EOddStatus}`) => {
  if (!status) return <></>;

  switch (status) {
    case 'ACTIVE':
      return <Tag.Active />;
    case 'SUSPENDED':
      return <Tag.Pending title="Suspended" />;
    case 'VOID':
      return (
        <Tag
          textColor={colors.secondary}
          backgroundColor={hexToRgba(colors.secondary, 0.12)}
          borderColor={hexToRgba(colors.secondary, 0.3)}
          title="Cancelled"
        />
      );
    case 'DRAFT':
      return <Tag color={colors.greyLighter} title="Draft" />;
    default:
      return <Tag color={colors.greyLighter} title={firstLetterUppercase(status)} />;
  }
};

export const getCriterionStatusTag = (status?: `${CriterionStatusEnum}`) => {
  if (!status) return <></>;

  switch (status) {
    case 'ACTIVE':
      return <Tag.Active />;
    case 'SUSPENDED':
      return <Tag.Pending title="Suspended" />;
    case 'VOID':
      return (
        <Tag
          textColor={colors.secondary}
          backgroundColor={hexToRgba(colors.secondary, 0.12)}
          borderColor={hexToRgba(colors.secondary, 0.3)}
          title="Cancelled"
        />
      );
    case 'DRAFT':
      return <Tag color={colors.greyLighter} title="Draft" />;
  }
};

export const getBetSlipItemStatusTag = (status: `${IBetSlipItemStatus}`) => {
  switch (status) {
    case 'PENDING':
      return <Tag.Pending />;
    case 'WON':
      return <Tag.Active title="Won" />;
    case 'LOST':
      return <Tag color={colors.secondary} title="Lost" />;
    case 'VOIDED':
      return <Tag color={colors.greyLighter} title="Voided" />;
  }
};
