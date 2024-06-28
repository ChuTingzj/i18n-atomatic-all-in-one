# i18n-atomatic-all-in-one

## webpack-loader
### vue2
**case(based on RegExp)**
1. 使用中文的属性值
```html
<template>
  <img alt="图片描述" src="example.jpg" />
</template>
```

2. 标签内的文本节点
```html
<template>
  <div>
    <p>这是一个段落。</p>
    <h1>标题</h1>
    <button>提交</button>
  </div>
</template>
```

3. 函数的入参
```html
<script>
export default {
  methods: {
    onClick() {
      alert('这是一个提示信息');
    },
  },
};
</script>
```

4. 在data函数中定义的变量
```html
<script>
export default {
  data() {
    return {
      info: '这是一些信息',
    };
  },
};
</script>
```

5. 在方法中定义的变量
```html
<script>
export default {
  methods: {
    onClick() {
      const info = '这是一个提示信息'
      alert(info);
    },
  },
};
</script>
```
### vue3
**case(based on RegExp)**
1. 使用中文的属性值
```html
<template>
  <img alt="图片描述" src="example.jpg" />
</template>
```

2. 标签内的文本节点
```html
<template>
  <div>
    <p>这是一个段落。</p>
    <h1>标题</h1>
    <button>提交</button>
  </div>
</template>
```

3. 函数的入参
```html
<script setup lang="ts">
import {ref} from 'vue'
const info = ref('提示')
const onClick = () =>  alert('这是一个提示信息')
</script>
```

4. 在方法中定义的变量
```html
<script setup lang="ts">
const onClick = () => {
    const info = '这是一个提示信息'
    alert(info)
}
</script>
```

5. 对象中的中文
```html
<script setup lang="ts">
import {reactive} from 'vue'
const info = reactive({message:'这是一个提示信息'})
const onClick = () =>  alert(info.message)
</script>
```

### react
**case(based on RegExp)**
1. 使用中文的属性值
```jsx
export const Component = () => {
    return (
        <img alt="图片描述" src="example.jpg" />
    )
}
```

2. 标签内的文本节点
```jsx
export const Component = () => {
    return (
        <div>
            <p>这是一个段落。</p>
            <h1>标题</h1>
            <button>提交</button>
        </div>
    )
}
```

3. 函数的入参
```jsx
import {useCallback} from 'react'
export const Component = () => {
  const fn = (message) => alert(message)
  fn('消息') 
}
```

4. 在方法中定义的变量
```jsx
export const Component = () => {
    const handler = () => {
        const message = '消息'
        alert(message)
    }
    return (
        <div>123</div>
    )
}
```

5. 对象中的中文
```jsx
import {useMemo} from 'react'
export const Component = () => {
    const obj = useMemo(()=>({name:'姓名'}),[])
    return (
        <div>123</div>
    )
}
```
## License

[MIT](LICENSE).
