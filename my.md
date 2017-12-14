
slide-flow-control

1.名称：slide-flow-control
  
2.功能：对很多对象进行处理

3.地址：http://github.com/HuoYanru/slide-flow-control

4.仓库包含的文件及作用

  1)lib：
  
      async-map-ordered.js (66)  ：对结果进行排序
      
      async-map.js (55) ：判断传入参数的格式是否正确，定义回调函数
      
      bind-actor.js (17)  ：绑定回调函数事件
      
      chain.js (21)  ：按顺序执行
      
      slide.js (4)  ：暴露项目中的函数模块
      
  2)index.js   
  
      暴露模块
        
  3)test:
  
      chain.js    //测试代码
      
  4)README.md
  
      对项目的说明
    
  5).gitignore
  
      用来排除不必要的项目文件或敏感信息文件，在此文件中写入的文件不会被提交到远程仓库
    
  6)LICENSE
    
      文件用的ISC协议，ISC许可证是一种开放源代码许可证
    
  7)package.json
  
      存储工程的元数据，描述项目的依赖项，类似配置文件
  
  8).travis.yml
  
      travis.yml持续集成工具的配置文件
    
  9)test文件
  
      包含对index.js的测试文件
    
5.项目类型：第三方库

6.数据结构种类

    字符串：类型判断，值判断，截取赋值等

    对象：作为函数返回值，作为对象的属性，类型判断等
  
7.所用语法

    for循环语句，if语句，三目运算符，LOOP，forEach
   
 8.代码模块
 
      asyncMap              暴露模块
      asyncMapOrdered       暴露模块
      bindActor             暴露模块
      chain                 暴露模块
    
 9.	项目中所有的模块都有单元测试吗？哪些有？哪些没有？这样安排的理由是什么？
      
        没有
        
 10.项目中是否用到持续集成？持续集成做了哪些事情？
      
        用到
      
 11.	代码中是否有 bug？
 
         没有发现
        
 12.代码中是否有可以改进的地方？
 
       没有
    
 13.项目是如何划分模块、划分函数的，划分的好吗？如果是你，你会怎么做？
    
      划分的很好
      
 14.	代码的可读性如何？结构清晰吗？编码风格如何？
 
         可读性不好，全篇没有注释，结构很清晰，编码风格比较好
