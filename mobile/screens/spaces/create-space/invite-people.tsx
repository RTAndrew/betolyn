import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { SearchAndAddUser, SearchAndAddUserProps } from '@/components/search-and-add-user';
import { useWizardPrimaryAction } from '@/components/wizard/use-wizard';
import { UserService } from '@/services';

import { CreateSpaceWizardStepProps } from './utils';

type InvitePeopleProps = CreateSpaceWizardStepProps<'invitation'>;

export const InvitePeople = ({ setNext, onChange, allData, goNext, data }: InvitePeopleProps) => {
  useWizardPrimaryAction(goNext);

  const onSelect: SearchAndAddUserProps['onSelect'] = useCallback((members) => {
    onChange(members.map((m) => ({ id: m.id, username: m.title })) ?? []);
  }, []);

  const onSearch: SearchAndAddUserProps['onSearch'] = useCallback(async (search: string) => {
    const response = await UserService.findAllUsers({
      username: search,
      email: search,
      id: search,
    });
    return response.data.map((user) => ({
      id: user.id,
      title: user.username,
    }));
  }, []);

  useEffect(() => {
    setNext?.({
      variant: 'solid',
      label: (data ?? []).length > 0 ? 'Próximo' : 'Ignorar',
    });
  }, [data, setNext]);

  return (
    <View style={styles.root}>
      <SearchAndAddUser
        onSearch={onSearch}
        onSelect={onSelect}
        id="create-space-invite-people"
        defaultSelectedMembers={allData?.invitation?.map((m) => ({ id: m.id, title: m.username }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
