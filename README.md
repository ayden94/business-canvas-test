# 요구사항 분석

저는 이 프로젝트의 요구사항을 큰 틀에서 두 가지 방향으로 이해했습니다. 한 가지는 어디서든 전역적으로 호출할 수 있는 Dialog의 존재입니다. Table이 어떻게 구현될지 아직 확실하지 않은 만큼 최대한 stateless하게 Dialog를 구현하면 좋겠다 생각했습니다. 두 번째는 Table과 Column입니다. ant design 라이브러리에서 Table 컴포넌트는 Column에 따라 date를 자동으로 처리합니다. 때문에 column를 어딘가에서는 처리해야 하는데, 이걸 동적으로 관리할 수 있도록 미리 구조를 짜두면 좋겠다고 생각했습니다. 


## Dialog

전역적으로 호출할 수 있는 Dialog는 세 개의 파트로 나뉘어집니다. 우선 Dialog ui를 구성하는 **Dialog Component**, 전역적으로 Dialog를 호출하기 위한 **DialogStore**, 그리고 DialogStore를 통해 호출된 Dialog Component를 랜더링하는 최상단의 **DialogWrapper**가 바로 그것입니다. Dialog 컴포넌트 자체는 dialog 태그로 구현되어있으며, useDialogHandler 훅을 통해 필요한 자원을 제공받습니다. Dialog 컴포넌트의 children에서도 Dialog를 닫을 수 있도록 DialogContext.Provider를 사용하였으며, 이는 합성 컴포넌트 패턴(compound component pattern)으로도 볼 수 있지 않을까 합니다.

```tsx
export default function Dialog() {
  const [disabled, setDisabled] = useState(false);
  const { closeDialog, handleLightDismiss, dialogRef } = useDialogHandler();

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-[rgba(33, 33, 33, 0.4)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-[8px]"
      onClick={handleLightDismiss}
    >
      <DialogContext.Provider value={{ closeDialog, disabled, setDisabled }}>
        {DialogStore.store && <DialogStore.store.component {...DialogStore.store.props} />}
      </DialogContext.Provider>
    </dialog>
  );
}
```

DialogWrapper는 DialogStore의 변화를 감지하여 Dialog 컴포넌트를 화면에 그려냅니다. 이 DialogWrapper는 children으로 App 컴포넌트를 받기 때문에 Router의 존재에도 영향을 받지 않으며, basic stacking order를 생각하면 원칙적으로는 dialog 태그를 사용하지 않더라도 (다른 요구사항이 생겨 태그를 변경해야 하더라도) 언제나 최상단에 랜더링됩니다.

```tsx
export function DialogWrapper({ children }: { children: ReactElement | ReactElement[] }) {
  const [_, renderingTrigger] = useState(false);

  useEffect(() => {
    const handleStoreChange = () => {
      rerenderingTrigger((prev) => !prev);
    };

    DialogStore.addListener(handleStoreChange);
    return () => DialogStore.removeListener(handleStoreChange);
    ;
  }, []);

  return (
    <>
      {children}
      {DialogStore.store && <Dialog />}
    </>
  );
}
```
```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DialogWrapper>
      <App />
    </DialogWrapper>
  </StrictMode>,
);
```

DialogStore는 옵저버 패턴을 활용한 스태틱 클래스입니다. 이 클래스에서는 store 속성에 상태가 변경될 때마다 등록된 리스너들에 알림을 보내도록 구성되어 있습니다. 처음에는 싱글턴 클래스로 만들고자 했지만 호출을 위해 생성해야 한다는 점에서 최종적으로는 스태틱하게 처리하였습니다. 이 store는 component와 props로 이루어진 객체를 보관하며, 이 객체는 앞서 살펴본 Dialog 컴포넌트 내에서 랜더링됩니다.

```tsx
type StoreItem = {
  component: (props: any) => JSX.Element;
  props: any
}

export class DialogStore {
  static _store: StoreItem | undefined;
  static listeners: Function[] = [];

  static get store() {
    return this._store;
  }

  static set store(value: StoreItem | undefined) {
    if (value !== undefined && this._store !== undefined) return;

    this._store = value;
    this.listeners.forEach((listener) => listener());
  }

  static addListener(listener: Function) {
    this.listeners.push(listener);
  }

  static removeListener(listener: Function) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}
```

Dialog를 호출하고 싶을 때는 DialogStore.store 메서드를 사용합니다. 덕분에 Dialog는 컴포넌트 랜더링을 위한 state 조건이나 rules of hooks에서 벗어나 조금 더 유연하게 호출될 수 있습니다.

```tsx
  const handleClick = () => {
    DialogStore.store = {
      component: DialogRecordFormSlot,
      props: { title: '회원 생성', type: 'add' },
    };
  };
```

## Table

ant design 라이브러리의 Table 컴포넌트는 columns라는 프로퍼티를 통해 전체 테이블을 랜더링합니다. 따라서 columns 생성을 적절하게 추상화하는 것이 무엇보다 중요하다고 생각했습니다. 제가 내린 결론은 columns의 각 column 생성을 각 클래스로 분리하고, ColumnFactory를 사용해 필요한 column만 생성하도록 하는 것이었습니다.

```tsx
export class ColumnFactory {
  private columnMap: Map<string, new () => Column> = new Map([
    ['이메일 수신 동의', EmailAgreementColumn],
    ['레코드 수정 버튼', RecordEditKebabColumn],
  ]);

  createColumn(key: keyof Record, records: Record[]): IColumnConfig {
    const ColumnClass = this.columnMap.get(key);

    if (ColumnClass) {
      return new ColumnClass().exec(key, records);
    } else {
      return new BasicColumn().exec(key, records);
    }
  }
}
```

이 ColumnFactory 클래스는 getColumnByRecords라는 이름의 함수에서 호출됩니다. 이 함수는 ColumnList를 근거로 필요한 컬럼을 생성합니다. 이처럼 생성과 사용이 분리되면, 컬럼 생성 로직을 수정하거나 확장할 때 ColumnFactory 클래스만 변경하면 되며, getColumnByRecords 함수는 그대로 유지될 수 있어 코드의 재사용성과 유지보수성이 높아집니다. 또한, 컬럼의 생성과 관련된 로직을 한 곳에 집중시킴으로써, 새로운 컬럼이 추가될 때마다 함수나 클래스의 변경 없이 쉽게 확장할 수 있는 구조를 제공합니다.

```tsx
export const getColumnByRecords = <T extends Array<Record>>(
  records: T,
): TableProps<Record>['columns'] => {
  const columns: TableProps<Record>['columns'] = [];

  // 추후 전역 상태로 분리 가능
  const ColumnList = [
    '이름',
    '주소',
    '메모',
    '가입일',
    '직업',
    '이메일 수신 동의',
    '레코드 수정 버튼',
  ];

  for (const key of ColumnList) {
    columns.push(new ColumnFactory().createColumn(key as Label, records));
  }

  return columns;
};
```


































