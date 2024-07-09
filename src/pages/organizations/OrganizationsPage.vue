<template>
    <h1 class="page-title">{{ $t('menu.organizations') }}</h1>
  
    <VaCard>
      <VaCardContent>
        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
          <div class="flex flex-col md:flex-row gap-2 justify-start">
            <VaInput v-model="search" :placeholder="$t('search.placeholder')">
              <template #prependInner>
                <VaIcon name="search" color="secondary" size="small" />
              </template>
            </VaInput>
          </div>
          <VaButton @click="showAddOrganizationModal">{{ $t('organizations.add') }}</VaButton>
        </div>
  
        <VaAlert v-if="error" color="danger">
          {{ error }}
        </VaAlert>
  
        <VaDataTable
          :items="filteredOrganizations"
          :columns="columns"
          :loading="isLoading"
        >
          <template #cell(limit)="{ rowData }">
            {{ rowData.limit }}
          </template>
          <template #cell(actions)="{ rowData }">
            <div class="flex gap-2 justify-end">
              <VaButton
                preset="primary"
                size="small"
                icon="edit"
                :aria-label="$t('organizations.edit')"
                @click="showEditOrganizationModal(rowData)"
              />
              <VaButton
                preset="primary"
                size="small"
                icon="delete"
                color="danger"
                :aria-label="$t('organizations.delete')"
                @click="onOrganizationDelete(rowData)"
              />
            </div>
          </template>
        </VaDataTable>
      </VaCardContent>
    </VaCard>
  
    <VaModal
      v-model="showModal"
      :title="editingOrganization ? $t('organizations.edit') : $t('organizations.add')"
      @ok="saveOrganization"
    >
      <VaForm ref="form">
        <VaInput
          v-model="organizationForm.name"
          :label="$t('organizations.name')"
          :rules="[v => !!v || $t('organizations.nameRequired')]"
        />
        <VaInput
          v-model.number="organizationForm.limit"
          :label="$t('organizations.limit')"
          type="number"
          :rules="[v => v > 0 || $t('organizations.limitPositive')]"
        />
      </VaForm>
    </VaModal>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useOrganizations } from '../users/composables/useOrganizations';
  import { Organization } from '../users/types';
  import { useModal, useToast } from 'vuestic-ui';
  import { useI18n } from 'vue-i18n';
  
  const { t } = useI18n();
  
  const { organizations, isLoading, error, fetch, add, updateLimit, remove } = useOrganizations();
  
  const columns = [
    { key: 'name', sortable: true, label: t('organizations.name') },
    { key: 'limit', sortable: true, label: t('organizations.limit') },
    { key: 'actions', align: 'right', label: t('organizations.actions') },
  ];
  
  const search = ref('');
  const showModal = ref(false);
  const organizationForm = ref<Partial<Organization>>({});
  const editingOrganization = ref<Organization | null>(null);
  
  const filteredOrganizations = computed(() => {
    return organizations.value.filter(org => 
      org.name.toLowerCase().includes(search.value.toLowerCase())
    );
  });
  
  const showAddOrganizationModal = () => {
    editingOrganization.value = null;
    organizationForm.value = {};
    showModal.value = true;
  };
  
  const showEditOrganizationModal = (organization: Organization) => {
    editingOrganization.value = organization;
    organizationForm.value = { ...organization };
    showModal.value = true;
  };
  
  const { init: notify } = useToast();
  const { confirm } = useModal();
  
  const saveOrganization = async () => {
    try {
      if (editingOrganization.value) {
        await updateLimit(editingOrganization.value.id, organizationForm.value.limit!);
        notify({ message: t('organizations.updateSuccess'), color: 'success' });
      } else {
        await add(organizationForm.value as Omit<Organization, 'id'>);
        notify({ message: t('organizations.addSuccess'), color: 'success' });
      }
      showModal.value = false;
      await fetch();
    } catch (err: any) {
      notify({ message: err.message || t('organizations.saveError'), color: 'danger' });
    }
  };
  
  const onOrganizationDelete = async (organization: Organization) => {
    const agreed = await confirm({
      title: t('organizations.deleteConfirmTitle'),
      message: t('organizations.deleteConfirmMessage', { name: organization.name }),
      okText: t('organizations.delete'),
      cancelText: t('organizations.cancel'),
    });
  
    if (agreed) {
      try {
        await remove(organization.id);
        notify({ message: t('organizations.deleteSuccess'), color: 'success' });
        await fetch();
      } catch (err: any) {
        notify({ message: err.message || t('organizations.deleteError'), color: 'danger' });
      }
    }
  };
  
  // Fetch organizations when the component is mounted
  fetch();
  </script>
  
  <style scoped>
  .page-title {
    margin-bottom: 1rem;
  }
  
  .flex {
    display: flex;
  }
  
  .flex-col {
    flex-direction: column;
  }
  
  .gap-2 {
    gap: 0.5rem;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .justify-start {
    justify-content: flex-start;
  }
  
  .justify-end {
    justify-content: flex-end;
  }
  
  @media (min-width: 768px) {
    .md\:flex-row {
      flex-direction: row;
    }
  }
  </style>